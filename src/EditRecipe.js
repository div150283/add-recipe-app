import React, { Component } from 'react';
import AppNav from './AppNav';
import Footer from './Footer';
//import {Container} from 'reactstrap';
import './App.css';
import {Link} from 'react-router-dom';
import {Container, Button, Form, Input, Label, FormGroup} from 'reactstrap';
import fs from 'fs';

class EditRecipe extends Component {
  emptyRecipe = {
    id: '0',
    name: 'Default Recipe',
    image: '/recipes/recipe-background-alt.jpg',
    ingredients: 'Rice',
    preparation: 'Boil the rice',
    category: {id: '1', name: 'Vegan'}
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      imageFilePath: null,
      categories: [],
      recipes: [],
      recipe: this.emptyRecipe,
      file: "null",
      base64URL: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let recipe = {...this.state.recipe};
    recipe[name] = value;
    this.setState({recipe});
  }


 
  
 
  handleChangeImage(event) {
    const target = event.target;
    const value = target.files[0].name;
    const name = target.name;
    let recipe = {...this.state.recipe};
    recipe[name] = value;
    this.setState({recipe});
    console.log(target.files[0]);
    
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const fileBuffer = fileReader.result;
      const newFile = new File([fileBuffer], `${file.name}`, { type: file.type });
      //const filePath= process.env.PUBLIC_URL;
    
      //console.log("new file path"+filePath);
      //const fileWriter = new FileWriter();
      //fileWriter.write(newFile);
      //fileWriter.write(file, 'E:/recipeProject/add-recipe-app/public/' + value);
    };
  };
  
    
  
 
  

  handleChangeCategory(event) {
    const target = event.target;
    const selectedIndex = target.selectedIndex + 1;
    const value = target.value;
    const name = target.name;
    let recipe = {...this.state.recipe};
    recipe[name].id = selectedIndex;
    recipe[name].name = value;
    this.setState({recipe});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {recipe} = this.state;
    await fetch('http://localhost:9090/api/recipex', {
      method: 'POST',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(recipe)
    }).then(response => {
      if(response.ok) {
        window.alert('Recipe saved successfully!');
        
      }
    })
    .catch(error => {
      window.alert('Error saving recipe:', error);
    });
    console.log(recipe);
  }
   
  

  async componentDidMount() {
    const responseCategory = await fetch('http://localhost:9090/api/categories');
    const bodyCategory = await responseCategory.json();
    this.setState({
      categories: bodyCategory,
      isLoading: false
    });

    const responseRecipe = await fetch('http://localhost:9090/api/recipes');
    const bodyRecipe = await responseRecipe.json();
    this.setState({
      recipes: bodyRecipe,
      isLoading: false
    });
  }

  render() {
    
    const { data } = this.props.location;
    
    const title = <h3 className="pt-3" style={{display: 'flex', justifyContent: 'center'}}>{data.name} Recipe</h3>
    const ingredientsTitle = <h4 className="mt-1 pt-2" style={{display: 'flex', justifyContent: 'left'}}> Ingredients </h4>
    
    const ingredientMulti=data.ingredients;
    const ingredientLines = ingredientMulti.replace(/\n/g, "<br>");
    const ingredientsText = <p className="pt-2" style={{display: 'flex', justifyContent: 'left'}} dangerouslySetInnerHTML={{__html: ingredientLines}}></p>
    const preparationTitle = <h4 className="pt-2" style={{display: 'flex', justifyContent: 'left'}}> Preparation </h4>
    const multilinestring=data.preparation;
    const lines = multilinestring.replace(/\n/g, "<br>");
    console.log("lines"+lines);
    const preparationText = <p className="pt-2" style={{display: 'flex', justifyContent: 'left'}} dangerouslySetInnerHTML={{__html: lines}}></p>
  
    //console.log("preparation text"+(JSON.stringify(data.preparation)).split("\n"));
    //console.log("preparationText"+JSON.stringify({preparationText}));
    const imagePathString = data.image;
    const imageLink = <img className="Recipe-image ml-5 mr-5 mt-40" style={{display: 'flex', justifyContent: 'left'}} src={imagePathString} alt="Test"/>
    
    //const title = <h3 className="pt-2" style={{display: 'flex', justifyContent: 'center'}}>Add New Recipe</h3>
    const {categories, isLoading} = this.state;

    if(isLoading) {
      return (
        <div>Loading...</div>
      );
    }

    let optionList = categories.map(category => <option id={category.id}>{category.name}</option>);


    
    return (
      <div className="Site">
        <AppNav/>
        <div className="Home-image"></div>
        <Container className="Site-content">
          {title}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Title</Label>
              <Input type="name" name="name" id="name" onChange={this.handleChange} autoComplete="name" value={data.name}/>
            </FormGroup>

            <FormGroup>
              <Label for="image">Select an image: </Label>
              <input className="mt-2 ml-2" type="file" name="image" onChange={this.handleChangeImage} />
            </FormGroup>

            <FormGroup>
              <Label for="category">Category</Label>
              <select className="ml-1" name="category" id="category" onChange={this.handleChangeCategory}>
                {optionList}
              </select>
            </FormGroup>

            <FormGroup>
              <Label for="ingredients">Ingredients</Label>
              <Input type="textarea" name="ingredients" id="ingredients" onChange={this.handleChange} value={ingredientMulti}/>
            </FormGroup>

            <FormGroup>
            <Label for="preparation">Preparation</Label>
              <Input type="textarea" name="preparation" id="preparation" onChange={this.handleChange} value={multilinestring}/>
            </FormGroup>

            <FormGroup>
              <Button size="sm" color="primary" type="submit">Update Recipe</Button>
              <Button size="sm" className="ml-1" color="secondary" tag={Link} to="/">Cancel</Button>
            </FormGroup>
          </Form>
        </Container>
        <Footer/>
      </div>
    );

  }
}

export default EditRecipe;