import React from "react";

import { Tree, TreeNode } from "react-organizational-chart";
import _ from "lodash";
import clsx from "clsx";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import organization from "./org.json";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "white",
    display: "inline-block",
    paddingTop: 8,
    paddingBottom: 8,
  },
  expand: {
    transform: "rotate(0deg)",
    marginTop: -10,
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.short,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#ECECF4",
  },
  cardContent: {
    textAlign: "left",
  }
}));

function Organization({ org, onCollapse, collapsed }) {
  const classes = useStyles();

  return (
    <Card
      variant="outlined"
      className={classes.root}
    >
      <CardHeader
        avatar={
          org?.type === "department" ? (
            <Avatar className={classes.avatar}>
              <GroupsIcon color="primary" />
            </Avatar>
          ) : (
            <Avatar className={classes.avatar}>
              <BusinessIcon color="primary" />
            </Avatar>
          )
        }
        title={
          <Typography variant="subtitle1" color="primary">
            {org.tradingName}
          </Typography>
        }
      />
      <IconButton
        color="primary"
        size="small"
        onClick={onCollapse}
        className={clsx(classes.expand, {
          [classes.expandOpen]: !collapsed,
        })}
      >
        <ExpandMoreIcon />
      </IconButton>
    </Card>
  );
}

function Account({ a }) {
  const classes = useStyles();
  return (
    <Card
      variant="outlined"
      className={classes.root}
      style={{ cursor: "pointer" }}
    >
      <CardHeader
        avatar={
          <Avatar className={classes.avatar} />
        }
        title={
          <div className={classes.cardContent}>
            <Typography variant="caption" color="secondary.light">{a.position}</Typography>
            <Typography variant="body2" style={{ fontWeight: 600 }}>{a.name}</Typography>
          </div>}
      />
    </Card>
  );
}

function Node({ o, parent }) {
  const [collapsed, setCollapsed] = React.useState(o.collapsed);
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  React.useEffect(() => {
    o.collapsed = collapsed;
  });
  const T = parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth={"2px"}
          lineColor={"#bbc"}
          lineBorderRadius={"12px"}
        >
          {props.children}
        </Tree>
      );
  return collapsed ? (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    />
  ) : (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    >
      {_.map(o.account, (a, index) => (
        <TreeNode label={<Account a={a} />} key={index} />
      ))}
      {_.map(o.organizationChildRelationship, (c, index) => (
        <Node o={c} parent={o} key={index} />
      ))}
    </T>
  );
}

export default function App(props) {
  return (
    <Box padding={4} sx={{ overflow: 'scroll' }}>
      <Node o={organization} />
    </Box>
  );
}
