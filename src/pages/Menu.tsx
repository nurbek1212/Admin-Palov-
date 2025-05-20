import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useBasket } from '../context/BasketContext';
import { useNavigate } from 'react-router-dom';


const Menu = () => {
  const { addToBasket }: any = useBasket();

  const menuItems = [
    {
      id: 1,
      name: "Palov",
      description: "An'anaviy O'zbek palovi, qo'y go'shti bilan",
      price: 35000,
      image: "https://www.orexca.com/img/cuisine/plov/uzbek-pilaf.jpg"
    },
    { 
      id: 2,
      name: "Mastava",
      description: "Sho'rva, qo'y go'shti, sabzavotlar bilan",
      price: 25000,
      image: "https://c8.alamy.com/comp/2BA8FG8/mastava-uzbek-rice-soup-on-white-table-great-image-for-your-needs-2BA8FG8.jpg"
    },
    {
      id: 3,
      name: "Lag'mon",
      description: "Qo'lda yorilgan xamir, go'sht va sabzavotlar bilan",
      price: 30000,
      image: "https://t4.ftcdn.net/jpg/02/31/48/03/360_F_231480324_BqyB5EmbS8LQg2uPF9SZHLovPQK8MfuO.jpg"
    },
    {
      id: 4,
      name: "Shashlik",
      description: "Qo'y go'shtidan tayyorlangan shashlik",
      price: 20000,
      image: "https://media.istockphoto.com/id/657429140/photo/grilled-pork-skewers.jpg?s=612x612&w=0&k=20&c=foS1Jm3qHMOutNHOFZx4duh5TWoL06jenAi1uVm7MRM="
    },
    {
      id: 5,
      name: "Dimlama",
      description: "Qo'y go'shti va sabzavotlardan tayyorlangan dimlama",
      price: 30000,
      image: "https://www.shutterstock.com/shutterstock/photos/340429133/display_1500/stock-photo-vegan-version-of-uzbek-vegetable-stew-dimlama-340429133.jpg"
    },
    {
      id: 6,
      name: "Chuchvara",
      description: "Qo'lda yasalgan chuchvara, qatiq bilan",
      price: 22000,
      image: "https://www.shutterstock.com/image-photo/dumplings-soup-chuchvara-manti-lamb-600nw-2260357617.jpg"
    }
    // ... boshqa taomlar
  ];
  const navigate = useNavigate();

  const handleAdd = (item: any) => {
    addToBasket({ ...item, quantity: 1 });
    navigate('/basket'); // kerakli sahifaga yo‘naltiradi
  };

  return (
    <div className='menu-section pt-5'>
      <Container>
        <h1 className="text-white mb-4 text-center pt-5">Menyu</h1>
        <Row xs={1} md={2} lg={3} className="g-4">
          {menuItems.map((item) => (
            <Col key={item.id}>
              <Card className="bg-dark text-white h-100">
                <Card.Img variant="top" src={item.image} height="200px" style={{ objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{item.price.toLocaleString()} so'm</span>
                    <Button variant="outline-light" onClick={() => handleAdd(item)}>
                      Savatga
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Menu;
