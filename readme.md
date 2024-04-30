# Connor's Local Llama Chat

This is a local llama chat app I've been working on. Pretty straightforward. It consumes Ollama running llama3.

## The Stack

- Sveltekit
- TailwindCSS with DaisyUI
- Ollama with Llama3
- Drizzle ORM with sqlite drivers

## Want to use it?

I wouldn't recommend it yet. However, if you really want to use this as your base template for your own project, just be sure to change the sqlite memory so it isn't under `:memory`. I just do that while I'm developing so I can test fresh instances every time.
