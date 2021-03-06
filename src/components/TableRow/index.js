import * as React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import _ from "lodash";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import HourglassIcon from '@mui/icons-material/HourglassTop';
import { addNotification } from '../../store/actions/notifications';
import { capitalizeFirstLetter } from '../../utils/helpers.js';
import {
  STATUS_DENIED,
  STATUS_REQUESTED,
} from '../../utils/consts'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
function CustomRow(props) {
  const dispatch = useDispatch();
  const {
    row,
    onEdit,
    type,
    headers,
    onOpenDeclineModal,
    onOpenGrantModal,
    onOpenCreateRequestModal,
    onOpenCancelRequestModal,
  } = props;
  const [open, setOpen] = React.useState(false);
  const hasDetails = Array.isArray(row.details) && row.details.length > 0;
  const detailsLength = row.details ? Object.keys(row.details).length : 0;

  const handleDeleteRequest = () => {
    dispatch(addNotification({
      message: 'Deleting request',
      date: format(new Date(), 'HH:mm:ss MM/dd/yyyy'),
      isRead: false,
    }));
  }

  const handleCancelRequest = () => {
    onOpenCancelRequestModal({
      targetId: row?.id,
      targetName: row?.legal_name,
    });
  }

  const handleRequestAccess = () => {
    onOpenCreateRequestModal({
      targetId: row?.id,
      targetName: row?.legal_name,
    });
  }

  const handleGrantAccess = () => {
    if (type === 'requests') {
      onOpenGrantModal({
        targetId: row?.target_id,
        requestedById: row?.admin_id,
        targetName: row?.target.legal_name,
        requesterName: row?.source.displayName,
      });
    } else if (type === 'account_requests') {
      onOpenGrantModal({
        targetId: row?.target_id,
        requestedById: row?.admin_id,
        targetName: row?.legal_name,
        requesterName: row?.display_name,
      });
    }
  }

  const handleDeclineAccess = () => {
    if (type === 'requests') {
      onOpenDeclineModal({
        targetId: row?.target_id,
        requestedById: row?.admin_id,
        targetName: row?.target.legal_name,
        requesterName: row?.source.displayName,
      });
    } else if (type === 'account_requests') {
      onOpenDeclineModal({
        declineId: row?.id,
        targetId: row?.target_id,
        requestedById: row?.admin_id,
        targetName: row?.legal_name,
        requesterName: row?.display_name,
      });
    }
  }

  const idField = type === 'search' ? 'id' : 'target_id';

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {headers.map(header => header.field).map((item, index) => (
          <TableCell key={index} component="th" scope="row">
            {headers[index]?.isLink ?
              <Link to={`/accounts/${row[idField]}`} style={{ textDecoration: 'none' }}>
                {_.get(row, item)}
              </Link>
              : _.get(row, item)
            }
          </TableCell>
        ))}
        {type === "editing" && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={onEdit}
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
        )}
        {type === "search" && (
          <TableCell>
            {row.status === STATUS_DENIED && (
              <Button
                sx={{ fontWeight: '700', whiteSpace: 'nowrap' }}
                onClick={handleRequestAccess}
              >
                Request Access
              </Button>
            )}
            {row.status === STATUS_REQUESTED && (
              <Button
                sx={{ fontWeight: '700', whiteSpace: 'nowrap' }}
                color="grey"
                onClick={handleCancelRequest}
              >
                Cancel Access
              </Button>
            )}
          </TableCell>
        )}
        {type === "mine" && (
          <TableCell>
            {row.status === STATUS_REQUESTED && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <HourglassIcon color="grey" />
                <Typography variant="body" sx={{ px: 1 }}>
                  Pending
                </Typography>
              </Box>
            )}
          </TableCell>
        )}
        {(type === "requests" || type === "account_requests") && (
          row.status === STATUS_REQUESTED ? (
          <TableCell>
            <Button
              sx={{ fontWeight: '700', whiteSpace: 'nowrap' }}
              onClick={handleGrantAccess}
            >
              Grant Access
            </Button>
            <Button
              sx={{ fontWeight: '700', whiteSpace: 'nowrap' }} color="grey"
              onClick={handleDeclineAccess}
            >
              Decline Access
            </Button>
          </TableCell>
        ) : <TableCell />)}
        {type === "my_requests" && (
          <TableCell />
        )}
        {type === "users" && (
          <TableCell>
            {row?.canRemove && (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={handleDeleteRequest}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </TableCell>
        )}
      </StyledTableRow>
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

