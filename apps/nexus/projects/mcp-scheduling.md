A framework-agnostic tool router for MCP (Model Context Protocol) servers. Routes agent requests to the fastest available tool when similar tools exist, decreasing response latency by ~64% (tool dependent) on average across 824 benchmark questions.

Tool similarity is determined by computing vector embeddings of each tool's description, then grouping duplicates via cosine similarity, letting the router identify functionally equivalent tools automatically.

Tested against [Google's Frames dataset](https://huggingface.co/datasets/google/frames-benchmark) using Gemini Flash with a custom agent built using LangChain.
