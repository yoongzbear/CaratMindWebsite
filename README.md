# CaratMindWebsite

Nur Alya Mastura

Technology Stack:
Frontend: NextJS
Backend: Django
AWS services: DynamoDB, S3, Cognito, EC2, Elastic Beanstalk, CloudFront, Simple Email Service
Frontend hosting: Vercel

Check out the recorded demo here: https://youtu.be/_kZ5Yv-DaeU 

### To run on localhost
1. Start LLM Service 
```
cd CaratMindWebsite\caratmindbackend\llm-service
uvicorn app:app --host 0.0.0.0 --port 8001
```
2. Start Django backend
```
cd CaratMindWebsite\caratmindbackend\caratmind
python manage.py runserver 8000
```
3. Start NextJS frontend
```
cd CaratMindWebsite\caratmind
npm run dev
```
**Note: .env files for both NextJS and Django components have empty values to avoid exposing credentials from AWS service account 

**Note: Please download the Qwen 2.5 1.5b-Instruct model and insert to Django at "CaratMindWebsite\caratmindbackend\llm-service"

Link to model download: https://drive.google.com/drive/folders/1EThUEKO1wV5qOIdA1m9IH6LnPtunDadc?usp=sharing 

For any inquiries in the source code, please contact Alya Mastura at masturalya04@gmail.com 
