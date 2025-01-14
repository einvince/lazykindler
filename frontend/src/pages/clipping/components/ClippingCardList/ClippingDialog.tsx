import { ClippingDataType, CommentDataType } from '@/pages/data';
import { addHighlight, deleteHighlight, getClippingByUUIDs } from '@/services';
import { createComment, deleteComment, getCommentsByRelatedUUID } from '@/services/comment';
import { convertRange, handleClippingContent } from '@/util';
import { Comment } from '@ant-design/compatible';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { Avatar, Button as AntdButton, Form, Input } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { FormattedMessage } from 'umi';

import hetiStyles from './heti.min.css';

const { TextArea } = Input;

type ClippingDialogProps = {
  uuid: string;
  open: boolean;
  handleClose: any;
  clippingContent: string;
  highlights: any;
  book_name: string;
  fetchClippings: any;
};

const initialHighlightInfo = {
  uuid: '',
  selectedText: '',
  open: false,
};

const initialDeleteCommentInfo = {
  open: false,
  comment_uuid: '',
};

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
  <>
    <Form.Item style={{ float: 'left' }}>
      <TextArea
        style={{ backgroundColor: 'darkseagreen', width: '70vw' }}
        rows={3}
        onChange={onChange}
        value={value}
      />
    </Form.Item>
    <Form.Item style={{ float: 'right', marginBottom: 0, paddingTop: 10 }}>
      <AntdButton htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        <FormattedMessage id="pages.highlight.comment.add" />
      </AntdButton>
    </Form.Item>
  </>
);

export default function ClippingDialog(props: ClippingDialogProps) {
  const { uuid, open, handleClose, clippingContent, highlights, book_name, fetchClippings } = props;

  const [clippingHighlights, setClippingHighlights] = useState<string[]>([]);

  const [comments, setComments] = useState<CommentDataType[]>([]);
  const [textArea, setTextArea] = useState<string>('');
  const [deleteCommentInfo, setDeleteCommentInfo] = useState<any>(initialDeleteCommentInfo);
  const [submitting, setSubmitting] = useState(false);

  const [highlighInfo, setHighlightInfo] = useState(initialHighlightInfo);

  const getClipping = () => {
    getClippingByUUIDs(uuid).then((data: ClippingDataType[]) => {
      setClippingHighlights(data[0].highlights);
    });
  };

  useEffect(() => {
    setClippingHighlights(highlights);
  }, [highlights]);

  const getComments = (uuid: string) => {
    getCommentsByRelatedUUID(uuid).then((data) => {
      setComments(data);
    });
  };

  useEffect(() => {
    getComments(uuid);
  }, [uuid]);


  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setTextArea('');
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <div style={{ backgroundColor: 'darkseagreen' }}>
          <DialogTitle id="alert-dialog-title">
            <article className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']}`}>
            <FormattedMessage id="pages.highlight.comment.from" />《{book_name} 》
            </article>
          </DialogTitle>
          <DialogContent style={{ paddingBottom: 0 }}>
            <Divider />
            <article
              className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']} ${hetiStyles['heti-hang']} ${hetiStyles['heti-meta heti-small']} `}
              style={{
                paddingTop: 10,
                fontSize: 16,
                whiteSpace: 'pre-wrap',
                maxHeight: '47vh',
                overflow: 'auto',
              }}
              onMouseUp={() => {
                let selectedText = window.getSelection()!.toString();
                if (selectedText !== '') {
                  let info = {
                    open: true,
                    selectedText: selectedText,
                    uuid: uuid,
                  };
                  setHighlightInfo(info);
                }
              }}
            >
              <Highlighter
                // style={{ fontSize: 17 }}
                highlightStyle={{ color: 'red' }}
                searchWords={clippingHighlights || []}
                autoEscape={true}
                textToHighlight={handleClippingContent(clippingContent) || ''}
              />
            </article>
            <br />

            {comments.length}<FormattedMessage id="pages.highlight.comment.length" />
            <Divider />

            <div style={{ maxHeight: '20vh', overflow: 'auto' }}>
              {comments.length > 0 &&
                _.map(comments, (item: CommentDataType, index: number) => {
                  return (
                    <Comment
                      key={index}
                      style={{ backgroundColor: 'darkseagreen' }}
                      actions={[
                        <span
                          key="comment-list-reply-to-0"
                          onClick={() => {
                            setDeleteCommentInfo({
                              open: true,
                              comment_uuid: item.uuid,
                            });
                          }}
                        >
                          <FormattedMessage id="pages.highlight.comment.action.delete" />
                        </span>,
                      ]}
                      author={<FormattedMessage id="pages.highlight.comment.author" />}
                      avatar={`/avatar/${convertRange(new Date().getDate(), [1, 31], [1, 16])}.svg`}
                      content={<p>{item.content}</p>}
                      datetime={moment(item.create_time).fromNow()}
                    />
                  );
                })}
            </div>
            <Comment
              avatar={
                <Avatar
                  src={`/avatar/${convertRange(new Date().getDate(), [1, 31], [1, 16])}.svg`}
                  alt="Han Solo"
                />
              }
              style={{ backgroundColor: 'darkseagreen' }}
              content={
                <Editor
                  onChange={(e: any) => {
                    setTextArea(e.target.value);
                  }}
                  onSubmit={() => {
                    if (textArea === '') {
                      return;
                    }
                    setSubmitting(true);
                    setTimeout(() => {
                      createComment(uuid, textArea).then(() => {
                        getComments(uuid);
                      });
                      setTextArea('');
                      setSubmitting(false);
                    }, 200);
                  }}
                  submitting={submitting}
                  value={textArea}
                />
              }
            />
          </DialogContent>
        </div>
      </Dialog>

      <div>
        <Dialog
          open={highlighInfo.open}
          onClose={() => {
            setHighlightInfo(initialHighlightInfo);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.highlight.action.highlight" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="pages.highlight.action.highlight.info" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setHighlightInfo(initialHighlightInfo);
              }}
            >
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                setHighlightInfo(initialHighlightInfo);
                deleteHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(() => {
                  getClipping();
                  fetchClippings();
                });
              }}
            >
              <FormattedMessage id="pages.highlight.action.highlight.delete" />
            </Button>
            <Button
              onClick={() => {
                addHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(() => {
                  getClipping();
                  fetchClippings();
                });
                setHighlightInfo(initialHighlightInfo);
              }}
              autoFocus
            >
              <FormattedMessage id="pages.ok" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={deleteCommentInfo.open}
          onClose={() => {
            setDeleteCommentInfo(initialDeleteCommentInfo);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.warning" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="pages.highlight.comment.action.delete.info" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteCommentInfo(initialDeleteCommentInfo);
              }}
            >
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                deleteComment(deleteCommentInfo.comment_uuid).then(() => {
                  getComments(uuid);
                });
                setDeleteCommentInfo(initialDeleteCommentInfo);
              }}
              autoFocus
            >
              <FormattedMessage id="pages.ok" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
