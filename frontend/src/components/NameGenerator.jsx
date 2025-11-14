import React, { useEffect, useMemo, useState } from 'react'
import { generateNames, fetchCommunities } from '../api.js'

export default function NameGenerator() {
    const [communities, setCommunities] = useState(["bengali", "gujarati", "punjabi"]) // fallback
    const [community, setCommunity] = useState('all')
    const [gender, setGender] = useState('any')
    const [count, setCount] = useState(5)
    const [fullName, setFullName] = useState(true)
    const [meaning, setMeaning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [status, setStatus] = useState('')


useEffect(() => {
    fetchCommunities().then((list) => setCommunities(list)).catch(() => {})
}, [])

const communityOptions = useMemo(() => ['all', ...communities], [communities])


const onGenerate = async () => {
    setLoading(true)
    setStatus('')
    try {
        const data = await generateNames({ community, gender, count, fullName:true, meaning:true })
        setResults(data.results)
        setStatus(`Generated ${data.count}`)
    } catch (e) {
        setStatus('Error generating')
    } finally {
        setLoading(false)
    }
} 

const copyAll = async () => {
    if (!results.length) return
    await navigator.clipboard.writeText(results.map(r => r.name).join('\n'))
    setStatus('Copied all')
    setTimeout(() => setStatus(''), 1000)
}

return (
    <div style={{ display: 'flex', flexDirection: "column",alignItems:'center', gap: 24 }}>
        <div style={{ background: '#FFEB99', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Community</label>
                <select value={community} onChange={(e) => setCommunity(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 12, border: '1px solid #cbd5e1', marginTop: 6 }}>
                    {communityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Gender</label>
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    {['any','male','female'].map(g => (
                        <label key={g} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input type="radio" name="gender" value={g} checked={gender===g} onChange={() => setGender(g)} /> {g}
                        </label>
                    ))}
                </div>
            </div>

                    
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                
                
    </div>


    <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700 }}>How many</label>
        <input type="number" min={1} max={50} value={count} onChange={(e)=>setCount(Math.max(1, Math.min(50, Number(e.target.value)||1)))} style={{ width: 100, padding: 8, borderRadius: 12, border: '1px solid #cbd5e1', marginLeft: 8 }} />
    </div>


    <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onGenerate} disabled={loading} style={{ padding: '8px 16px', borderRadius: 12, background: '#4f46e5', color: '#fff', fontWeight: 700, border: 0 }}>{loading ? 'Generating…' : 'Generate'}</button>
        <button onClick={copyAll} style={{ padding: '8px 16px', borderRadius: 12, background: '#e2e8f0', border: 0 }}>Copy</button>
    </div>


<div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>{status}</div>
</div>


<div>
<div style={{ background: '#FFEB99', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
<h2 style={{ marginTop: 0, textAlign: 'center' }}>Results</h2>
<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
{results.map((r, idx) => (
<li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid #e2e8f0', borderRadius: 12 }}>
<div>
<div style={{ fontWeight: 700 }}>{r.name}</div>
<div style={{ fontSize: 12, color: '#64748b' }}>{r.meaning ? `(${r.meaning})` : ''}</div>
</div>
<button onClick={() => navigator.clipboard.writeText(r.name)} style={{ fontSize: 12, padding: '4px 8px', borderRadius: 8, background: '#f1f5f9', border: 0 }}>Copy</button>
</li>
))}
</ul>
</div>
</div>
</div>
)
}   