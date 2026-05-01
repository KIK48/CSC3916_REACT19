import React, { useEffect, useState } from 'react';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);
  const loggedIn = useSelector(state => state.auth.loggedIn);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(submitReview(movieId, Number(rating), reviewText));
    setReviewText('');
    setRating(5);
  };

  if (loading) return <div>Loading....</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedMovie || !selectedMovie.actors || !selectedMovie.reviews) {
    return <div>Loading movie details...</div>;
  }

  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>
      <Card.Body>
        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>
      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
        <ListGroupItem>
          {selectedMovie.actors.map((actor, i) => (
            <p key={i}>
              <b>{actor.actorName}</b> {actor.characterName}
            </p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4>
            <BsStarFill /> {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'N/A'}
          </h4>
        </ListGroupItem>
      </ListGroup>
      <Card.Body className="card-body bg-white">
        {selectedMovie.reviews.map((review, i) => (
          <p key={i}>
            <b>{review.username}</b>&nbsp; {review.review}&nbsp;
            <BsStarFill /> {review.rating}
          </p>
        ))}
      </Card.Body>
      {loggedIn && (
        <Card.Body className="bg-light">
          <h5>Add a Review</h5>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group controlId="rating" className="mb-2">
              <Form.Label>Rating (1–5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={e => setRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="reviewText" className="mb-2">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Submit Review</Button>
          </Form>
        </Card.Body>
      )}
    </Card>
  );
};

export default MovieDetail;
