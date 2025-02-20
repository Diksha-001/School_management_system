import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  makeStyles,
} from '@material-ui/core';
import {
  Class as ClassIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import DashboardCard from '../Common/DashboardCard';
import CreateClassDialog from '../Class/CreateClassDialog';
import CreateAssignmentDialog from '../Assignment/CreateAssignmentDialog';
import { createAssignment, getAssignments } from '../../redux/slices/assignmentSlice';
import { getClasses, createClass } from '../../redux/slices/classSlice';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  welcomeMessage: {
    marginBottom: theme.spacing(4),
  },
  listItem: {
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}));

const TeacherDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { classes: classList, loading: classLoading } = useSelector((state) => state.class);
  const { assignments, loading: assignmentLoading } = useSelector((state) => state.assignment);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getClasses());
    dispatch(getAssignments());
  }, [dispatch]);

  const upcomingSchedule = [
    { id: 1, title: 'Class 10-A Mathematics', time: '9:00 AM - 10:00 AM' },
    { id: 2, title: 'Class 11-C Physics', time: '11:00 AM - 12:00 PM' },
  ];

  const recentActivities = [
    { id: 1, description: 'Posted new assignment for Class 10-A', time: '2 hours ago' },
    { id: 2, description: 'Updated attendance for Class 11-C', time: '4 hours ago' },
  ];

  const handleCreateClass = async (classData) => {
    try {
      await dispatch(createClass(classData)).unwrap();
      // Refresh classes list
      dispatch(getClasses());
      setIsClassDialogOpen(false); // Close dialog after successful creation
    } catch (error) {
      console.error('Failed to create class:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await dispatch(createAssignment(assignmentData)).unwrap();
      setIsAssignmentDialogOpen(false);
      // Refresh assignments list
      dispatch(getAssignments());
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  // Get today's schedule from classes
  const getTodaySchedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return classList
      .filter(cls => cls.schedule?.dayOfWeek === today)
      .map(cls => ({
        id: cls._id,
        title: `${cls.name} ${cls.subject}`,
        time: `${cls.schedule.startTime} - ${cls.schedule.endTime}`
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.welcomeMessage} gutterBottom>
        Teacher Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Classes */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="My Classes">
            <List>
              {classList.map((class_) => (
                <ListItem key={class_._id} className={classes.listItem}>
                  <ListItemIcon>
                    <ClassIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={class_.name}
                    secondary={`${class_.subject} | ${class_.students?.length || 0} students`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.addButton}
              fullWidth
              onClick={() => setIsClassDialogOpen(true)}
            >
              Create New Class
            </Button>
          </DashboardCard>
        </Grid>

        {/* Assignments */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Active Assignments">
            <List>
              {assignments.map((assignment) => (
                <ListItem key={assignment._id} className={classes.listItem}>
                  <ListItemIcon>
                    <AssignmentIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={assignment.title}
                    secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.addButton}
              fullWidth
              onClick={() => setIsAssignmentDialogOpen(true)}
            >
              Create Assignment
            </Button>
          </DashboardCard>
        </Grid>

        {/* Schedule */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Today's Schedule">
            <List>
              {getTodaySchedule().map((schedule) => (
                <ListItem key={schedule.id} className={classes.listItem}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={schedule.title}
                    secondary={schedule.time}
                  />
                </ListItem>
              ))}
              {getTodaySchedule().length === 0 && (
                <ListItem>
                  <ListItemText primary="No classes scheduled for today" />
                </ListItem>
              )}
            </List>
          </DashboardCard>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Recent Activities">
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} className={classes.listItem}>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </DashboardCard>
        </Grid>
      </Grid>

      <CreateClassDialog
        open={isClassDialogOpen}
        onClose={() => setIsClassDialogOpen(false)}
        onSubmit={handleCreateClass}
      />

      <CreateAssignmentDialog
        open={isAssignmentDialogOpen}
        onClose={() => setIsAssignmentDialogOpen(false)}
        onSubmit={handleCreateAssignment}
        classes={classList}
      />
    </Container>
  );
};

export default TeacherDashboard; 