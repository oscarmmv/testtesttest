import React from 'react';
import projectData from './projects.json';

const ProjectPage = ({ projectId }) => {
    const project = projectData.projects.find(p => p.id === projectId);

    if (!project) {
        return <div>Project not found</div>;
    }

    const { title, desc, img } = project;

    return (
        <div className="project-page">
            <h1>{title}</h1>
            <p>{desc}</p>
            <img src={img} alt={title} />
        </div>
    );
};

export default ProjectPage;