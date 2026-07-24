import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateTournament() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entry_fee: '',
    max_participants: '',
    game_mode: 'BR'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tournament-backend-991a.onrender.com';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/tournaments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          entry_fee: parseFloat(formData.entry_fee),
          max_participants: parseInt(formData.max_participants),
          start_date: new Date().toISOString(),
          registration_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Failed to create tournament');
        return;
      }

      router.push('/tournaments');
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Create tournament error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a1428',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a2d4d',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#FFD700',
          marginBottom: '30px',
          fontSize: '2em'
        }}>
          ➕ Create Tournament
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
              Tournament Title:
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                boxSizing: 'border-box',
                minHeight: '100px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
              Entry Fee:
            </label>
            <input
              type="number"
              name="entry_fee"
              value={formData.entry_fee}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
              Max Participants:
            </label>
            <input
              type="number"
              name="max_participants"
              value={formData.max_participants}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
              Game Mode:
            </label>
            <select
              name="game_mode"
              value={formData.game_mode}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="BR">Battle Royale</option>
              <option value="TD">Team Deathmatch</option>
              <option value="CS">Clash Squad</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#6b7280' : '#FFD700',
              color: '#000000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1em',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </form>
      </div>
    </div>
  );
}
