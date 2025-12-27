import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";

function Proudects() {
  const [proudects, setProudects] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/all`)
      .then((res) => {
        console.log(res.data.products);

        setProudects(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      {proudects &&
        proudects.map((item, i) => {
          return (
            <div key={i} className="allcards">
              <Card className="carditems" style={{ width: "18rem" }}>
                <Card.Img src={item.imgsrc} alt="product" />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>
                    {item.description} <br />
                    Price :{item.price}
                    <br />
                    rate : {item.rate}
                  </Card.Text>
                  <Button variant="primary" onClick={() => addToCart()}>
                    Add To Cart
                  </Button>

                  
                </Card.Body>
              </Card>
            </div>
          );
        })}
    </div>
  );
}

export default Proudects;
