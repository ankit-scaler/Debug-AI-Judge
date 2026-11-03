// The graded entry point (see question.json's testEntry). Each file below
// registers its own tests on the shared harness as a side effect of being
// imported; order matters for the shared-backend files (cart.test.js builds
// up state that api.test.js's PATCH/DELETE test runs after, and
// resilience.test.js's pricing-failure toggle runs last so it never affects
// an earlier test). CartContext.test.jsx is fully isolated (its own fetch
// override) and does not depend on the others.
import './cart.test.js';
import './api.test.js';
import './resilience.test.js';
import './CartContext.test.jsx';
