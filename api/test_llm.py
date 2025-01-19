from ollama import chat, ChatResponse

# Get user input
user_input = input("Enter your message: ")

# Send the input to the Ollama model
response: ChatResponse = chat(model="llama3.2", messages=[
    {
        "role": "system",
        "content": "Summarize the user's sentiment and provide a matching hex color code for the emotion."
    },
    {
        "role": "user",
        "content": user_input,
    },
])

# Print the model's response
print("Response from Llama3.2:")
print(response.message.content)  

