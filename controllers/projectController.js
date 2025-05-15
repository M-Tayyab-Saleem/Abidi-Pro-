const Project = require("../models/projectSchema");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    .populate('projectOwner')
    .populate('users')
    .populate('department');

    res.status(200).json(projects);
    console.log("Projects Found Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// Get Project by ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id)
    .populate('projectOwner')
    .populate('users')
    .populate('department');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// Update Project by ID
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    projectID,
    projectName,
    description,
    startDate,
    endDate,
    projectOwner,
    users,
    status,
    tasks,
    completedTasks,
    department
  } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.projectID = projectID || project.projectID;
    project.projectName = projectName || project.projectName;
    project.description = description || project.description;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.projectOwner = projectOwner || project.projectOwner;
    project.users = users || project.users;
    project.status = status || project.status;
    project.tasks = tasks || project.tasks;
    project.completedTasks = completedTasks || project.completedTasks;
    project.department = department || project.department;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
    console.log("Project Updated Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update project" });
  }
};


// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
