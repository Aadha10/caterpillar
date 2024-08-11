from dbr import BarcodeReader
import cv2 as cv
import sys

BarcodeReader.init_license("DLS2eyJoYW5kc2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==")

class ScanManager:
    def __init__(self):
        self.reader = BarcodeReader()
    
    def run(self):
        cap = cv.VideoCapture(0)
        qr_code_text = ""

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = self.reader.decode_buffer(frame)
            if results:
                for result in results:
                    qr_code_text = result.barcode_text
                    cap.release()
                    cv.destroyAllWindows()
                    return qr_code_text
        
        cap.release()
        cv.destroyAllWindows()
        return qr_code_text

if __name__ == "__main__":
    scan_manager = ScanManager()
    result = scan_manager.run()
    print(result)
