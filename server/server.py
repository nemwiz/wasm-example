from flask import Flask, request
from flask_cors import CORS
import zlib

app = Flask(__name__)
CORS(app)


@app.route('/upload', methods=["POST"])
def main():
    decompressed_data = zlib.decompress(request.data, -zlib.MAX_WBITS)
    csv_data = decompressed_data.decode('utf-8').splitlines()

    with open('test-data.csv', 'w') as csv_file:
        for line in csv_data:
            csv_file.write(line)
            csv_file.write('\n')

    return "ok"


if __name__ == '__main__':
    app.run(port="8000")
