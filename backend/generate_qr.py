from PIL import Image
import qrcode
import pymongo
from pymongo import MongoClient
import os
from dotenv import load_dotenv

def backgroundColor(image, r, g, b, a):
    image = image.convert('RGBA')
    newImage = []
    for item in image.getdata():
        if item[:3] == (255, 255, 255):
            newImage.append((r, g, b, a))
        else:
            newImage.append(item)
    image.putdata(newImage)
    return image

def codeColor(image, r, g, b, a):
    image = image.convert('RGBA')
    newImage = []
    for item in image.getdata():
        if item[:3] == (0, 0, 0):
            newImage.append((r, g, b, a))
        else:
            newImage.append(item)
    image.putdata(newImage)
    return image

def generate_qr_code(data, filename, bg_color, code_color):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill='black', back_color='white')
        
        img = backgroundColor(img, *bg_color)
        img = codeColor(img, *code_color)
        
        img.save(filename)
        print(f"Saved QR code as {filename}")
    except Exception as e:
        print(f"Error generating QR code: {e}")

def process_customers(mongo_uri, db_name):
    try:
        client = MongoClient(mongo_uri)
        db = client[db_name]
        customers_collection = db.customers
        
        customers = customers_collection.find()
        
        # Ensure the 'qr_codes' directory exists
        if not os.path.exists('qr_codes'):
            os.makedirs('qr_codes')
        
        for customer in customers:
            customerid = customer.get('customerid')
            truckserial = customer.get('truckserial')
            if customerid and truckserial:
                qr_text = f"CustomerID: {customerid}\nTruckSerial: {truckserial}"
                filename = f"qr_codes/{customerid}_{truckserial}_qr.png"
                generate_qr_code(qr_text, filename, (255, 255, 255, 0), (0, 0, 0, 255))
    
    except Exception as e:
        print(f"Error processing customers: {e}")
    finally:
        client.close()

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    mongo_uri = os.getenv('Mongo')
    print(f"MONGO_URI: {mongo_uri}")  # Print to check if the variable is correctly set
    if not mongo_uri:
        raise ValueError("MongoDB URI not found in environment variables.")
    db_name = "test"  # Replace with your database name
    process_customers(mongo_uri, db_name)

if __name__ == '__main__':
    main()
