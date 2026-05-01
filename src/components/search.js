import React, { useState } from 'react';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { searchMovies, setMovie } from '../actions/movieActions';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        setError(null);
        searchMovies(query).then(movies => {
            console.log('Search response:', movies);
            setResults(Array.isArray(movies) ? movies : []);
            setSearched(true);
        }).catch((err) => {
            console.error('Search error:', err);
            setError(err.message || 'Search failed. Check the console for details.');
            setResults([]);
            setSearched(true);
        });
    };

    const handleSelect = (movie) => {
        dispatch(setMovie(movie));
        navigate(`/movie/${movie._id}`);
    };

    return (
        <div className="container mt-4">
            <h3>Search Movies</h3>
            <p className="text-muted">Search by movie title or actor name (partial match supported)</p>
            <Form onSubmit={handleSearch} className="mb-3">
                <Form.Group controlId="query" className="mb-2">
                    <Form.Control
                        type="text"
                        placeholder="e.g. Inception, Leonardo DiCaprio"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Search</Button>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            {searched && !error && results.length === 0 && (
                <p>No movies found for "{query}".</p>
            )}

            {results.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Release Year</th>
                            <th>Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((movie, i) => (
                            <tr key={i} onClick={() => handleSelect(movie)} style={{ cursor: 'pointer' }}>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.releaseDate}</td>
                                <td>
                                    <BsStarFill />{' '}
                                    {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default Search;
