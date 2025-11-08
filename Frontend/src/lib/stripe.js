import { loadStripe } from '@stripe/stripe-js';

// Cargar Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QS5wMP0tQlj6zBvDummy');

export default stripePromise;
