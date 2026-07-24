import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Tournaments() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(savedUser));
    fetchTournaments();
  }, [router]);

  const fetchTournaments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tournament-backend-991a.onrender.com';
      const response = await fetch(`${apiUrl}/api/tournaments/`);
      const data = await response.json();
      setTournaments(data);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a1428',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '2.5em', color: '#FFD700' }}>🏆 Tournaments</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/tournaments/create"><a style={{ padding: '10px 20px', backgroundColor: '#4C1D95', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>➕ Create</a></Link>
            <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        ) : tournaments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#1a2d4d',
            borderRadius: '12px'
          }}>
            <p>No tournaments available yet.</p>
            <Link href="/tournaments/create"><a style={{ color: '#FFD700', textDecoration: 'none', marginTop: '20px' }}>Create the first one!</a></Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {tournaments.map(tournament => (
              <div
                key={tournament.id}
                style={{
                  backgroundColor: '#1a2d4d',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>{tournament.title}</h3>
                <p style={{ color: '#ccc', marginBottom: '10px' }}>{tournament.description}</p>
                <div style={{ marginBottom: '10px' }}>
                  <p>💰 Entry Fee: {tournament.entry_fee}</p>
                  <p>🎯 Max Participants: {tournament.max_participants}</p>
                  <p>🏅 Prize Pool: {tournament.prize_pool}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ flex: 1, padding: '8px', backgroundColor: '#FFD700', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Join</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
