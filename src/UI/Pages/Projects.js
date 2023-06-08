import React, { useEffect, useState } from 'react';
import PouchDB from 'pouchdb';
import 'pouchdb-adapter-http';

const db = new PouchDB('http://localhost:5984/dummydb');

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await db.allDocs({ include_docs: true });
        const fetchedProjects = result.rows.map(row => row.doc);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      {projects.map(project => (
        <div key={project._id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Projects;
