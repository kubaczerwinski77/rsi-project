import {
  Container,
  NumberInput,
  Group,
  TextInput,
  Button,
  Table,
  Alert,
  Flex,
  Loader,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

function App() {
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced] = useDebouncedValue(searchQuery, 300);

  const host =
    "https://rsiprojectspring.mangomeadow-d917f613.westeurope.azurecontainerapps.io";

  const onClickLoadList = () => {
    setLoading(true);
    setErrorText(null);
    setData(null);
    fetch(`${host}/persons`)
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          setData(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setErrorText(error);
        setLoading(false);
      });
  };

  const onClickLoadAuthors = () => {
    setLoading(true);
    setErrorText(null);
    fetch(`${host}/authors`)
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          setAuthors(data.authors);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onClickLoad = () => {
    if (id === "") {
      setErrorText("Podaj poprawne ID");
      return;
    }
    setLoading(false);
    setErrorText(null);
    fetch(`${host}/persons/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          setData([data]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setErrorText(error);
        setLoading(false);
      });
  };

  const onClickUpdate = () => {
    setLoading(true);
    setErrorText(null);
    fetch(`${host}/persons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(name && { name }),
        ...(age && { age }),
        ...(email && { email }),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          onClickLoadList();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onClickDelete = () => {
    if (id === "") {
      setErrorText("Podaj poprawne ID");
      return;
    }
    setLoading(true);
    setErrorText(null);
    fetch(`${host}/persons/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          onClickLoadList();
        }
        setLoading(false);
      })
      .catch((error) => {
        setErrorText(error);
        setLoading(false);
      });
  };

  const onClickAdd = () => {
    setLoading(true);
    setErrorText(null);
    fetch(`${host}/persons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(name && { name }),
        ...(age && { age }),
        ...(email && { email }),
        ...(height && { height }),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          onClickLoadList();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setErrorText(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    setErrorText(null);
    setData(null);
    const url = debounced
      ? `${host}/persons?name=${debounced}`
      : `${host}/persons`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setErrorText(data.detail);
        } else {
          setErrorText(null);
          setData(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setErrorText(error);
        setLoading(false);
      });
  }, [debounced]);

  return (
    <Container size="lg" style={{ padding: "50px" }}>
      <Flex direction="column" gap="lg">
        <Flex justify="space-between" align="flex-start" h="100px">
          <NumberInput
            value={id}
            onChange={(value) => setID(value)}
            label="ID"
            placeholder="Podaj ID"
            min={0}
          />
          <TextInput
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            label="Imię"
            placeholder="Podaj imię"
            error={
              name &&
              !/^[a-zA-Z]+$/.test(name) &&
              "Imię może zawierać tylko litery"
            }
          />
          <NumberInput
            value={age}
            onChange={(value) => setAge(value)}
            label="Wiek"
            placeholder="Podaj wiek"
            max={150}
            min={0}
          />
          <NumberInput
            value={height}
            onChange={(value) => setHeight(value)}
            label="Wzrost"
            placeholder="Podaj wzrost"
            precision={2}
            step={0.5}
            min={0}
          />
          <TextInput
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            label="Email"
            placeholder="Podaj email"
            error={
              email &&
              !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email) &&
              "Podaj poprawny email"
            }
          />
        </Flex>

        {authors && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Autorzy!"
            color="grape"
            withCloseButton
            onClose={() => setAuthors(null)}
          >
            {authors}
          </Alert>
        )}

        <Group grow>
          <Button onClick={onClickLoadList}>Wczytaj listę</Button>
          <Button onClick={onClickLoad} disabled={id === ""}>
            Wczytaj pozycję
          </Button>
          <Button
            onClick={onClickUpdate}
            disabled={
              id === "" ||
              (!age &&
                !height &&
                (!name || !/^[a-zA-Z]+$/.test(name)) &&
                (!email ||
                  !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)))
            }
          >
            Zaktualizuj pozycję
          </Button>
          <Button onClick={onClickDelete} disabled={id === ""}>
            Usuń pozycję
          </Button>
          <Button
            onClick={onClickAdd}
            disabled={
              !name ||
              !age ||
              !email ||
              !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email) ||
              !/^[a-zA-Z]+$/.test(name) ||
              !/^[0-9]+$/.test(age) ||
              !/^[0-9]+(\.[0-9]{1,2})?$/.test(height)
            }
          >
            Dodaj pozycję
          </Button>
          <Button color="pink" onClick={onClickLoadAuthors}>
            Autorzy
          </Button>
        </Group>

        {!errorText && (
          <TextInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            placeholder="Wyszukaj po imieniu"
            icon={<IconSearch size="0.8rem" />}
          />
        )}

        {loading && (
          <Container>
            <Loader />
          </Container>
        )}

        {errorText && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Błąd"
            color="red"
          >
            {errorText}
          </Alert>
        )}
        {data?.length === 0 && !errorText && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Brak danych"
            color="gray"
          >
            Brak danych do wyświetlenia
          </Alert>
        )}
        {data?.length > 0 && !errorText && (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>ID</th>
                <th style={{ width: "20%" }}>Imię</th>
                <th style={{ width: "20%" }}>Wiek</th>
                <th style={{ width: "20%" }}>Wzrost</th>
                <th style={{ width: "20%" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((person) => (
                <tr key={person.id}>
                  <td>{person.id}</td>
                  <td>{person.name}</td>
                  <td>{person.age}</td>
                  <td>{person.height}</td>
                  <td>{person.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Flex>
    </Container>
  );
}

export default App;
