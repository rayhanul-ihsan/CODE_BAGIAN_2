document.addEventListener('DOMContentLoaded', () => {
    // Model
    class ContactModel {
        constructor() {
            this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        }

        getContacts() {
            return this.contacts;
        }

        addContact(contact) {
            this.contacts.push(contact);
            this._commit();
        }

        editContact(index, updatedContact) {
            this.contacts[index] = updatedContact;
            this._commit();
        }

        deleteContact(index) {
            this.contacts.splice(index, 1);
            this._commit();
        }

        _commit() {
            localStorage.setItem('contacts', JSON.stringify(this.contacts));
        }
    }

    // View
    class ContactView {
        constructor() {
            this.form = document.getElementById('contact-form');
            this.nameInput = document.getElementById('name-input');
            this.phoneInput = document.getElementById('phone-input');
            this.contactList = document.getElementById('contact-list');

            this.form.addEventListener('submit', (event) => {
                event.preventDefault();
                this._handleAddContact();
            });
        }

        displayContacts(contacts) {
            while (this.contactList.firstChild) {
                this.contactList.removeChild(this.contactList.firstChild);
            }

            contacts.forEach((contact, index) => {
                const listItem = document.createElement('li');
                
                const contactInfo = document.createElement('span');
                contactInfo.textContent = `${contact.name}: ${contact.phone}`;
                
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-btn';
                editButton.addEventListener('click', () => this._handleEditContact(index));
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-btn';
                deleteButton.addEventListener('click', () => this._handleDeleteContact(index));
                
                listItem.appendChild(contactInfo);
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                
                this.contactList.appendChild(listItem);
            });
        }

        _handleAddContact() {
            const name = this.nameInput.value.trim();
            const phone = this.phoneInput.value.trim();

            if (name && phone) {
                this.onAddContact({ name, phone });
                this.nameInput.value = '';
                this.phoneInput.value = '';
            }
        }

        _handleEditContact(index) {
            const newName = prompt('Enter new name:', this.contacts[index].name);
            const newPhone = prompt('Enter new phone:', this.contacts[index].phone);

            if (newName && newPhone) {
                this.onEditContact(index, { name: newName, phone: newPhone });
            }
        }

        _handleDeleteContact(index) {
            this.onDeleteContact(index);
        }

        bindAddContact(handler) {
            this.onAddContact = handler;
        }

        bindEditContact(handler) {
            this.onEditContact = handler;
        }

        bindDeleteContact(handler) {
            this.onDeleteContact = handler;
        }
    }

    // Controller
    class ContactController {
        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.view.bindAddContact(this.handleAddContact);
            this.view.bindEditContact(this.handleEditContact);
            this.view.bindDeleteContact(this.handleDeleteContact);

            this.view.displayContacts(this.model.getContacts());
        }

        handleAddContact = (contact) => {
            this.model.addContact(contact);
            this.view.displayContacts(this.model.getContacts());
        }

        handleEditContact = (index, updatedContact) => {
            this.model.editContact(index, updatedContact);
            this.view.displayContacts(this.model.getContacts());
        }

        handleDeleteContact = (index) => {
            this.model.deleteContact(index);
            this.view.displayContacts(this.model.getContacts());
        }
    }

    const app = new ContactController(new ContactModel(), new ContactView());
});
