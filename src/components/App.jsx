import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components'; 
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { theme } from './utils/Theme.styled';
import { Box } from './Box/Box.styled'; 
import { ContactForm } from './Form/Form';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';

const LS_KEY = 'contacts';

export function App() {
  const [contacts, setContacts] = useState(() => {
    let readFromLSContacts = [];

    try {
      readFromLSContacts = JSON.parse(localStorage.getItem(this.LS_KEY));
    } catch (error) {
      console.log(
        'There is occurred error while attempting to read data from local storage!'
      );
    }

    return readFromLSContacts;
  });

  const [filterString, setFilter] = useState('');
  const filteredContacts = useMemo(() => {
    const normalizedFilter = filterString.toLowerCase().trim();

    if (!normalizedFilter) {
      return [];
    }

    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  }, [contacts, filterString]);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  function onContactAdd ({ name, number }) {
    if (hasContactWithName(name)) {
      Notify.warning("Can't add already existing contact");
      return;
    }

    setContacts(prevState => {
      const normName = name.trim();
      const updatedContacts = [
        ...prevState,
        { name: normName, number, id: nanoid() },
      ];

      return updatedContacts;
    });
  };

  function onRemoveContact(contactIdToRemove) {
    setContacts(prevState =>
      prevState.filter
        (({ id }) => id !== contactIdToRemove)
    );
  };

  function hasContactWithName(searchName) {
    if (!contacts) return;
    const searchNameNormalized = searchName.trim().toLowerCase();

    return contacts.some
      (({ name }) => name.toLowerCase() === searchNameNormalized
    );
  };
  
    return (
      <ThemeProvider theme={theme}>
        <Box
          width="wide"
          m={[3]}
          p={[3]}
          textAlign="center"
          borderRadius="small"
          boxShadow="medium"
        >
          <Box margin="0 auto" color="textColor">
            <h1>Phonebook</h1>
            <ContactForm onSubmitCallback={onContactAdd} />

            <Box
              width={0.85}
              margin="0 auto"
              mt={[4]}
              borderColor="accentSecondary"
              color="textColorSecondary"
            >
              <h2>Contacts</h2>
              <Filter value={filterString} onInputCallback={setFilter} />
              <ContactList
                contacts={filterString ? filteredContacts : contacts}
                onContactRemoveCallback={onRemoveContact}
              />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }