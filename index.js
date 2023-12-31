import express from "express"
import morgan from "morgan";
import cors from "cors"
const app = express();
app.use(express.json())
app.use(cors())
morgan.token('body',(req,res)=>{
    return JSON.stringify(req.body)
})
app.use(morgan(':method :status :res[content-length] :body'))
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
const genId = ()=>{
    const MaxId = notes.length > 0 ?Math.max(...notes.map(n=>n.id)):
    0; 
    return MaxId+1
}

app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})

app.get('/api/notes',(req,res)=>{
    res.json(notes)
})
app.get('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id);
    const note = notes.find(note=>note.id===id);
    if(note){
        res.json(note);
    }
    else{
        
        res.status(404).send("Error 404 not found");
    }
})

app.delete('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id);
    notes = notes.filter(note=>note.id!==id)
    res.status(204).end();
})
app.put('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id);
    const note = notes.find(note=>note.id===id)
    const change = {...note,important:!note.important}
    notes = notes.map(n=>n.id===id?change:n);
    res.json(change);
})

app.post('/api/notes',(req,res)=>{
    const body = req.body;
    if(!body.content){
        return res.status(404).json({error:'content missing'})
    }
    const note = {
        content:body.content,
        important:body.important || false,
        id:genId(),
    }
    notes = notes.concat(note)
    res.json(note);
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})