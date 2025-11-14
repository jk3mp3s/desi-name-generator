import React from 'react'
import NameGenerator from './components/NameGenerator.jsx'


export default function App() {
return (
<div 
    style={{ 
        fontFamily: 'Inter, system-ui, sans-serif', 
        background: '#FFEB99', 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' 
    }}
        
>
<header style={{ padding: '24px' }}>
<div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<h1 style={{ margin: 0, fontWeight: 800, fontSize: '42px' }}>Desi Name Generator</h1>

</div>

</header>
<main style={{width: '100%', maxWidth: 1000, paddingBottom: 60 }}>
<div style={{display: 'flex', justifyContent: 'center' }}>
<NameGenerator />
</div>
</main>
<footer style={{ textAlign: 'center', fontSize: 12, color: '#64748b', paddingBottom: 24 }}>
Built with ❤️ for your grandkids!
</footer>
</div>
)
}