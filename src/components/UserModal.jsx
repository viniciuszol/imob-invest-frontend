import { useState } from "react";
import Modal from "./Modal";
import UserFicha from "./UserFicha";
import UserForm from "./UserForm";

export default function UserModal({ user, onClose, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);

  return (
    <Modal
      title="Meu perfil"
      onClose={onClose}
    >
      {!edit ? (
        <UserFicha
          user={user}
          onEdit={() => setEdit(true)}
          onDelete={onDelete}
        />
      ) : (
        <UserForm
          user={user}
          onSave={(data) => {
            onSave(data);
            setEdit(false);
          }}
          onCancel={() => setEdit(false)}
        />
      )}
    </Modal>
  );
}
