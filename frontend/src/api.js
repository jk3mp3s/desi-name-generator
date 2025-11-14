const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050'


export async function fetchCommunities() {
    const res = await fetch(`${API_BASE}/api/communities`)
    if (!res.ok) throw new Error('Failed to fetch communities')
    const json = await res.json()
    return json.communities
}


export async function generateNames({ community='all', gender='any', count=5, fullName=true, meaning=false }) {
    const params = new URLSearchParams({ community, gender, count: String(count), fullName: String(fullName), meaning: String(meaning) })
    const res = await fetch(`${API_BASE}/api/generate?${params}`)
    if (!res.ok) throw new Error('Failed to generate')
    return res.json()
}