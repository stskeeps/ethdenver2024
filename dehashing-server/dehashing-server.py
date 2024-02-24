import subprocess
import os
import struct
import time

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib


os.dup2(1, 3)
os.dup2(1, 4)
os.dup2(1, 5)
os.dup2(1, 6)

pipe1_r, pipe1_w = os.pipe() # 7, 8
pipe2_r, pipe2_w = os.pipe() # 9, 10
pipe3_r, pipe3_w = os.pipe() # 11, 12
pipe4_r, pipe4_w = os.pipe() # 13, 14

os.close(3)
os.close(4)
os.close(5)
os.close(6)
print(os.dup2(pipe1_r, 3))
print(os.dup2(pipe2_w, 4))
print(os.dup2(pipe3_r, 5))
print(os.dup2(pipe4_w, 6))

os.set_inheritable(3, True)
os.set_inheritable(4, True)
os.set_inheritable(5, True)
os.set_inheritable(6, True)

rpc_url = os.getenv("ALCHEMY_RPC_URL")

child_process = subprocess.Popen(
    [
    "op-program",
    "--server",
    "--log.level", "trace",
    "--l1", rpc_url,
    "--l1.rpckind", "alchemy",
    "--l1.trustrpc",
    "--l1.head", "0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5"
    ],
    pass_fds = [3, 4, 5, 6]
)
def hint(x):
  hint_encoded = x.encode()
  encoded_hint = struct.pack('>I', len(hint_encoded)) + hint_encoded

  os.write(pipe1_w, encoded_hint)
  os.read(pipe2_r, 1)

def dehash(x):
    block_bytes = bytearray(bytes.fromhex(x))

    block_bytes[0] = 2 # keccak256

    os.write(pipe3_w, bytes(block_bytes))

    data_len = int.from_bytes(os.read(pipe4_r, 8), 'big')

    data = os.read(pipe4_r, data_len)
    return data


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        # Parse the URL and the query parameters
        path = urllib.parse.urlparse(self.path).path
        # Check if the path starts with /dehash/
        if path.startswith('/dehash/'):
            # Extract 'X' from the path
            x_value = path[len('/dehash/'):]
            # Here, you can access 'X' and do something with it
            print(f"Received dehashing request for: {x_value}")
            
            # Respond to the client
            self.send_response(200)
            self.send_header('Content-type', 'application/octet-stream')
            self.end_headers()
            self.wfile.write(dehash(x_value))
        elif path.startswith('/hint/'):
            x_value = urllib.parse.unquote(path[len('/hint/'):])
            print(f"Received hint: {x_value}")
            hint(x_value)
            self.send_response(200)
            self.send_header('Content-type', 'application/octet-stream')
            self.end_headers()
            self.wfile.write("ok".encode())
        else:
            # If the path does not match, send a 404 response
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', 8000)  # Serve on all addresses, port 8000
    httpd = server_class(server_address, handler_class)
    print("Starting httpd...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
