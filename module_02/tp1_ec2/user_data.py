import base64

user_data = base64.b64encode("""#!/bin/bash
echo "userdata-start"
apt update
apt install -y python3-pip python3.12-venv
git clone https://github.com/JunENSAI/Lab-API.git
cd Lab-API
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
venv/bin/python3 app.py
echo "userdata-end"
""".encode("ascii")).decode("ascii")