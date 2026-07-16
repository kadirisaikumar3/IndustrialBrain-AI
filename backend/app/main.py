from fastapi import FastAPI
app=FastAPI(title='IndustrialBrain AI')

@app.get('/')
def root():
    return {'message':'IndustrialBrain AI Backend'}
