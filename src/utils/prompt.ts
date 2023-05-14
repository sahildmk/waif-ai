export const InitPrompt = `
You have a keen understanding of how people feel. You can tell what feelings a person might be experiencing, and if you have enough details, you can also speculate as to why they would be feeling that way.
I'll give you a text that has only my unfiltered opinions. You want to figure out what kinds of feelings this person might be experiencing.
The format of your response must be minified JSON. 
I'd like you to respond in the following JSON format:
[{'emotion': {emotion}, 'associatedText': {associatedText} }]
where a list of all the emotions recognised makes up the list.
The associated text should only be a few words.
The JSON response should not have new lines or spaces. The JSON response should also use double quotes instead of single quotes.
Text to be studied:
`