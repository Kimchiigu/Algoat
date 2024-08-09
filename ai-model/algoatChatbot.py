import requests

# Your Azure OpenAI endpoint and keys
endpoint = "https://algoat.openai.azure.com/"
api_key = "141ea8e91529487795c8c212e75bbbfa"  # Use KEY 1 or KEY 2 interchangeably
# api_key = "1c176880bdd5404ea6609abdd54324d9"  # You can switch to KEY 2 if needed

# Set the headers
headers = {
    "Content-Type": "application/json",
    "api-key": api_key
}

# Define the payload
payload = {
    "model": "gpt-35-turbo",  # Replace with your specific model name
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Tell me a joke."}
    ]
}

# Make the request
response = requests.post(
    f"{endpoint}/openai/deployments/DEPLOYMENT_NAME/chat/completions?api-version=2023-05-15",
    headers=headers,
    json=payload
)

# Print the response
if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}, {response.text}")
