from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Language test API"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name} !"}

@app.get("/bonjour/{name}")
async def say_bonjour(name: str):
    return {"message": f"Bonjour {name} !"}

@app.get("/salama/{name}")
async def say_salama(name: str):
    return {"message": f"Salama {name} !"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)