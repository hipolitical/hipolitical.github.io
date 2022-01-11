import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import TableList from '../../components/TableList';
import SearchInput from '../../components/SearchInput';
import { getRequests, grantAccess } from '../../store/actions/requests';
import { getCurrentUserId, getCurrentUserType } from '../../utils/functions';
import { filterBySearchKeyword } from '../../utils/helpers';
import './style.css';

function Requests() {
  const dispatch = useDispatch();
  const accountsData = useSelector(state => state.requests);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const availableData = filterBySearchKeyword(accountsData.requests, searchKeyword);
  const [openDeclineModal, setOpenDeclineModal] = useState(false);
  const [openGrantModal, setOpenGrantModal] = useState(false);
  const [currentParams, setCurrentParams] = useState({});
  const [grantingStatus, setGrantingStatus] = useState(0);
  const UNDO_LIMIT = 10;

  React.useEffect(() => {
    dispatch(getRequests({
      userId: getCurrentUserId(),
      userType: getCurrentUserType(),
      limit: pageSize,
      page: pageNumber,
    }));
  }, [dispatch, pageSize, pageNumber]);

  const handleCloseDeclineModal = () => {
    setOpenDeclineModal(false);
  };

  const handleOpenDeclineModal = () => {
    setOpenDeclineModal(true);
  }

  const handleCloseGrantModal = () => {
    setOpenGrantModal(false);
    setGrantingStatus(0);
  };

  const handleOpenGrantModal = (params) => {
    setOpenGrantModal(true);
    setCurrentParams(params);
  }

  const handleGrantAction = () => {
    setGrantingStatus(grantingStatus + 1);
    if (grantingStatus === 1 && currentParams) {
      dispatch(grantAccess({
        requesterId: 1213311,
        ...currentParams,
      }));
    }
  }

  const handleUndoGrantAction = () => {
    setGrantingStatus(0);
  }

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too lale...</div>;
    }
  
    return (
      <div className="timer">
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <SearchInput
          value={searchKeyword}
          placeholder="Search requests"
          onChange={setSearchKeyword}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <TableList
          rows={availableData}
          headers={accountsData.headers}
          totalCount={availableData.length}
          isLoading={accountsData.isLoading}
          pageSize={pageSize}
          page={pageNumber}
          setRowsPerPage={setPageSize}
          setPageNumber={setPageNumber}
          onOpenDeclineModal={handleOpenDeclineModal}
          onOpenGrantModal={handleOpenGrantModal}
          type="requests"
        />
      </Box>
      <Dialog open={openDeclineModal} onClose={handleCloseDeclineModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Declining Request Modal</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  `Are you sure you want to decline access to <b>${currentParams.requesterName}</b> to <br/><b>${currentParams.targetName}</b>?`
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeclineModal}>Cancel</Button>
          <Button type="submit">Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openGrantModal} onClose={handleCloseGrantModal} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Granting Request Modal</DialogTitle>
        <DialogContent dividers>
          {grantingStatus === 0 &&
            <div
              dangerouslySetInnerHTML={{
              __html:
                `Are you sure you want to grant access to <b>${currentParams.requesterName}</b> to <br/><b>${currentParams.targetName}</b>?`
              }}
              style={{ lineHeight: '1.5rem' }}
            />
          }
          {grantingStatus === 1 &&
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CountdownCircleTimer
                size={60}
                strokeWidth={6}
                isPlaying={grantingStatus === 1}
                duration={UNDO_LIMIT}
                colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                onComplete={handleGrantAction}
              >
                {renderTime}
              </CountdownCircleTimer>
              <Typography variant="body" sx={{ ml: 3 }}>
                You can undo this request in the remaining time.
              </Typography>
            </Box>
          }
          {grantingStatus === 2 &&
            <div dangerouslySetInnerHTML={{
              __html:
                `The request has been sent.<br/><b>${currentParams.requesterName}</b> to <b>${currentParams.targetName}</b>`
              }}
              style={{ lineHeight: '1.5rem' }}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGrantModal}>Cancel</Button>
          <Button variant="contained" type="submit" onClick={handleGrantAction} disabled={grantingStatus === 2}>
            {grantingStatus === 1 ? 'Proceed' : 'Ok'}
          </Button>
          <Button variant="contained" type="submit" onClick={handleUndoGrantAction} disabled={grantingStatus !== 1}>Undo</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Requests;
