import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  makeStyles,
} from '@material-ui/core';
import {
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Event as EventIcon,
} from '@material-ui/icons';
import DashboardCard from '../Common/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignments } from '../../redux/slices/assignmentSlice';

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
}));

const StudentDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state) => state.assignment);
  
  useEffect(() => {
    dispatch(getAssignments());
  }, [dispatch]);

  // Mock data (replace with actual data from your backend)
  const courses = [
    { id: 1, name: 'Mathematics', teacher: 'Dr. Smith' },
    { id: 2, name: 'Physics', teacher: 'Prof. Johnson' },
    { id: 3, name: 'Chemistry', teacher: 'Dr. Williams' },
  ];

  const attendance = {
    present: 85,
    total: 100,
    percentage: '85%',
  };

  const upcomingEvents = [
    { id: 1, title: 'Mid-term Exam', date: '2024-03-01' },
    { id: 2, title: 'Science Fair', date: '2024-03-15' },
  ];

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.welcomeMessage} gutterBottom>
        Student Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        {/* Enrolled Courses */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="My Courses">
            <List>
              {courses.map((course) => (
                <ListItem key={course.id} className={classes.listItem}>
                  <ListItemIcon>
                    <ClassIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={course.name}
                    secondary={`Teacher: ${course.teacher}`}
                  />
                </ListItem>
              ))}
            </List>
          </DashboardCard>
        </Grid>

        {/* Assignments */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Assignments">
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
          </DashboardCard>
        </Grid>

        {/* Attendance */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Attendance Overview">
            <List>
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <TimelineIcon style={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`Attendance: ${attendance.percentage}`}
                  secondary={`Present: ${attendance.present}/${attendance.total} days`}
                />
              </ListItem>
            </List>
          </DashboardCard>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <DashboardCard title="Upcoming Events">
            <List>
              {upcomingEvents.map((event) => (
                <ListItem key={event.id} className={classes.listItem}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={`Date: ${event.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </DashboardCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 