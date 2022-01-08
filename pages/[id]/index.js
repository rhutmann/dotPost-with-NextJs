import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import { Confirm, Button, Loader } from "semantic-ui-react";

const Note = ({ note }) => {
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isDeleting) {
      deleteNote();
    }
  }, [isDeleting]);

  const deleteNote = async () => {
    const noteId = router.query.id;

    try {
      const deleted = await fetch(`${process.env.API_URI}/${noteId}`, {
        method: "DELETE",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const open = () => {
    setConfirm(true);
  };
  const close = () => {
    setConfirm(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    close();
  };
  return (
    <div className='note-container'>
      {isDeleting ? (
        <Loader active />
      ) : (
        <>
          <h1>{note.title}</h1>
          <h1>{note.description}</h1>
          <Button color='red' onClick={open}>
            Delete
          </Button>
        </>
      )}

      <Confirm open={confirm} onCancel={close} onConfirm={handleDelete} />
    </div>
  );
};

Note.getInitialProps = async ({ query: { id } }) => {
  const res = await fetch(`${process.env.API_URI}/${id}`);
  const { data } = await res.json();

  return { note: data };
};

export default Note;
