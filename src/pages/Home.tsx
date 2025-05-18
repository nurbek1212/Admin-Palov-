
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <section className="hero-wrapper">
      <div className="container hero-text">
        <h1 className="display-4 fw-bold text-white ">Admin Palov Markazi milliy taomlar</h1>
        <p className="lead text-white my-3">
          Mazali mahsulotlar, oshpazlar, an’anaviy ingredientlar, buyurtmalar, tez va ishonchli tizim, somsa, shurva,<br /> mastava, aksiyalar, mijozlar, xizmat.
        </p>

        <Link to="/order" className="btn btn-warning btn-lg mt-3">
          Band qilish
        </Link>
      </div>
      {/* Rasm tag */}
      <img src="/public/adim-palov.png" alt="Palov" className="hero-image" />
    </section>
  );
};

export default Home;
