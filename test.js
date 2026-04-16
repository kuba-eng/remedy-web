const text = "Tady je volno:\n\n[Rezervovat termín online](https://remedy.cz/rezervace)";
const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s\)]+\))/g);
parts.forEach(part => {
  const match = part.match(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/);
  if (match) {
     console.log("URL IS:", match[2]);
  }
});
