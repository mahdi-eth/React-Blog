import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { Col, Container } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import parse from "html-react-parser";

function NewArticle() {
  const [blogs, setBlogs] = useState(JSON.parse(localStorage.getItem("blogs")));
  const [file, setFile] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState();

  const articleCreator = () => {
    function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
    blobToBase64(file).then(res => {
      const data = {
        file: res,
        title,
        description,
        tags: tags.replaceAll(" ", "").split(","),
        id: Math.random(),
      };
      const LZLocalStorage = JSON.parse(localStorage.getItem("blogs"));
      localStorage.setItem(
        "blogs",
        JSON.stringify(
          LZLocalStorage?.length > 0 ? [...LZLocalStorage, data] : [data]
        )
      );
    });
  }; 

  return (
    <Container>
      <Form>
        <Dropzone onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}>
          {({ getRootProps, getInputProps }) => (
            <section className="form-control py-1 pt-3 bg-primary text-center bg-opacity-25 rounded mt-3 mb-3">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                  {file?.name
                    ? file.name
                    : "Drag & drop some files here, or click to select files"}
                </p>
              </div>
            </section>
          )}
        </Dropzone>
        <Form.Group className="mb-3">
          <Form.Label>
            <h2>Article Title</h2>
          </Form.Label>
          <Form.Control
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Article Title"
          />
        </Form.Group>
        <div className="App my-3">
          <h2>Artice description</h2>
          <CKEditor
            editor={ClassicEditor}
            data="<i>Write down your article here!</i>"
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>

        <Form.Group
          className="my-3"
          onChange={(e) => {
            setTags(e.target.value);
          }}
        >
          <Form.Label>
            Enter your tags and seprate them with commas ,
          </Form.Label>
          <Form.Control type="text" placeholder="Enter your tags" />
        </Form.Group>

        <Button onClick={articleCreator} className="mb-3">
          Create Article
        </Button>
      </Form>

      <Row>
        {blogs?.map((i) => (
          <Col className="m-3" key={i.id} xs={11} sm={5} lg={3} xl={2}>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={i?.file} />
              <Card.Body>
                <Card.Title>{i?.title}</Card.Title>
                <Card.Text>{parse(i?.description || "")}</Card.Text>
                {i.tags?.map((j) => (
                  <Badge className="mx-1" variant="primary">
                    {j}
                  </Badge>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default NewArticle;
