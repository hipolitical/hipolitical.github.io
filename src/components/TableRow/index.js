import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { capitalizeFirstLetter } from '../../utils/helpers.js';

function CustomRow(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const hasDetails = Array.isArray(row.details) && row.details.length > 0;
  const detailsLength = row.details ? Object.keys(row.details).length : 0;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {Object.keys(row).filter(item => item !== 'details').map((item, index) => (
          <TableCell key={index} component="th" scope="row">
            {row[item]}
          </TableCell>
        ))}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
          >
            <EditIcon />
          </IconButton>
          {hasDetails && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {hasDetails && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Details
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {Object.keys(row.details[0]).map((item, index) => (
                        <TableCell
                          key={index}
                          component="th"
                          scope="row"
                          align={index === detailsLength - 1 ? 'right' : 'left'}
                        >
                          {capitalizeFirstLetter(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.details.map((rowItem, index) => (
                      <TableRow key={index}>
                        {Object.values(rowItem).map((item, index) => (
                          <TableCell
                            key={index}
                            component="th"
                            scope="row"
                            align={index === detailsLength - 1 ? 'right' : 'left'}
                          >
                            {item}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

CustomRow.propTypes = {
  row: PropTypes.shape({}).isRequired,
};

export default CustomRow;
