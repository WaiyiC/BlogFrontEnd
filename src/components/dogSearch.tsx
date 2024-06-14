import 'antd/dist/reset.css';
import { useState } from 'react';
import { Input, message, Typography } from 'antd';
import axios from 'axios';
import { Table, Select, Col } from 'antd';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { api } from './common/http-common';

const { Column } = Table;
const { Search } = Input;
const { Title } = Typography;

function SearchDog() {
  let navigate: NavigateFunction = useNavigate();
  const [press, setPress] = useState("");
  const [dogsData, setDogs] = useState([]);
  const [isSearchOK, setSearch] = useState(false);

  const onSearch = async (value: any) => {
    console.log("value ", value);
    console.log("press ", `${press}`);
    let urlPath = `/api/v1/dogs`;
    if (press === "breed") {
      urlPath += `/breed/${value}`;
    } else if (press === "age") {
      urlPath += `/age/${value}`;
    } else if (press === "all" && value === "") {
      urlPath += `/`;
    }


    console.log("urlPath ", urlPath);

    return (await api.get(`${urlPath}`, {
      method: "GET",
      headers: { "Authorization": `Basic ${localStorage.getItem('aToken')}` }
    })
      .then(data => {
        console.log("dogs return  ", JSON.stringify(data));
        console.log("dogs data  ", data);
        if (!data.data.length || data.data.length == 0) {
          alert("No data found");
          navigate("/profile");
          window.location.reload();
        }
        setDogs(data.data);
        setSearch(true);
        value = "";
      })
      .catch(err => console.log("Error fetching dogs", err))
    )
    window.location.reload();
  }

  const { Option } = Select;

  function handleChange(value: any) {
    message.info("Pls. enter the breed or age of the dog to search");
    setPress(value);
    console.log(`selected ${value}`);
  }

  return (
    <>
      <Col span={16}>
        <Title level={3} style={{ color: "#0032b3" }}>Dog Search</Title>
        <Title level={5}>Find your favorite dog</Title>
        <Search placeholder="Search Dogs"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch} />
        <Select defaultValue="all" style={{ width: 280, marginRight: '200px' }} onChange={handleChange}>
          <Option value="breed">Breed</Option>
          <Option value="age">Age</Option>
          <Option value="all">Get all without filter</Option>
        </Select>
        {isSearchOK && <Table dataSource={dogsData}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Breed" dataIndex="breed" key="breed" />
          <Column title="Age" dataIndex="age" key="age" />
          <Column title="Description" dataIndex="description" key="description" />
        </Table>}
      </Col>
    </>
  );
}

export default SearchDog;
