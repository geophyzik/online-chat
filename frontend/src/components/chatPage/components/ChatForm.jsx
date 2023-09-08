import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import * as Yup from 'yup';

import { currentChannelMessages } from '../../../slices/messagesSlice.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { channelIdSelector, channelNameSelector } from '../../../slices/channelsSlice.js';
import { useWSocket } from '../../../context/WScontext.jsx';
import bgChatImage from '../../../assets/bg-chat.svg';

const ChatForm = () => {
  const auth = useAuth();
  const inputRef = useRef(null);
  const scrollbarRef = useRef(null);
  const wsocket = useWSocket();
  const { t } = useTranslation();

  const currentChannelId = useSelector(channelIdSelector);
  const currentNameChannel = useSelector(channelNameSelector);
  const messages = useSelector(currentChannelMessages);
  const user = auth.userName;

  // console.log(messages, auth.userName.username);

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId, messages]);

  useEffect(() => {
    scrollbarRef.current?.scrollIntoView();
  }, [messages.length]);

  const validationSchema = Yup.object().shape({
    body: Yup.string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const cleanBody = filter.clean(values.body);
      try {
        await wsocket.emitNewMessage({
          body: cleanBody,
          channelId: currentChannelId,
          username: user.username,
        });
        formik.resetForm();
      } catch (err) {
        console.log(err);
      }
      formik.setSubmitting(false);
    },
  });

  return (
    <>
      <div className="col p-0 h-100">
        <div
          className="d-flex flex-column h-100 bg-success bg-opacity-10"
          style={{
            backgroundImage: `url(${bgChatImage})`,
            // backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            backgroundOpacity: '50',
          }}
        >
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>
                {'# '}
                {currentNameChannel}
              </b>
            </p>
            <span className="text-muted">
              {t('messages.counter.count', { count: messages.length })}
            </span>
          </div>
          <div id="messages-box" className="chat-messages overflow-auto px-5">
            {messages.map((mess) => (mess.username === auth.userName.username ? (
              <div key={mess.id} className="text-break mb-2 d-flex justify-content-end" ref={scrollbarRef}>
                <div className="text-break border bg-info-subtle p-2 rounded">
                  <b>{mess.username}</b>
                  :
                  {' '}
                  {mess.body}
                </div>
              </div>
            ) : (
              <div key={mess.id} className="text-break mb-2" ref={scrollbarRef}>
                <div className="d-inline-flex bg-white p-2 rounded border">
                  <div>
                    <b>{mess.username}</b>
                  </div>
                  :
                  {' '}
                  {mess.body}
                </div>
              </div>
            )))}
          </div>
          <div className="mt-auto px-5 py-3">
            <Form
              onSubmit={formik.handleSubmit}
              noValidate
              className="py-1 border rounded-2 bg-white"
            >
              <Form.Group className="input-group has-validation">
                <Form.Control
                  className="border-0 p-0 ps-2"
                  onChange={formik.handleChange}
                  value={formik.values.body}
                  name="body"
                  aria-label="Новое сообщение"
                  ref={inputRef}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  placeholder="Введите сообщение..."
                />
                <Button type="submit" variant="group-vertical" disabled={formik.isSubmitting}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="20"
                    height="20"
                    fillRule="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                    />
                  </svg>
                  <span className="visually-hidden">{t('send')}</span>
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatForm;
