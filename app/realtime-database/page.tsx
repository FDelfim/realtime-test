'use client'
import React, { FormEvent } from 'react'
import { realtimeDB } from '@/db/firebase'
import { ref, set } from 'firebase/database'
import { useList } from 'react-firebase-hooks/database';
import Message from '@/components/Message';
import { Timestamp } from 'firebase/firestore/lite';

interface Message {
    message: {
      text: string,
      uid: string,
      photoURL: string,
      createdAt: Timestamp | string
    }
  }
  

export default function page() {

    const dbRef = ref(realtimeDB, 'messages');
    const [snapshots, loading, error] = useList(dbRef);

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const messageRef = ref(realtimeDB, 'messages/' + Date.now());
        await set(messageRef, {
            text: 'Hello, World!',
            createdAt: Date.now()
        });
    }

    return (
        <div className='p-8'>
          <p>
            {error && <strong>Error: {String(error) ?? '/'}</strong>}
            {loading && <span>List: Loading...</span>}
            {!loading && snapshots && (
              <React.Fragment>
                <span>
                    {
                        snapshots.map((msg, index) => {
                            const messageData = msg.val() as Message['message'];
                            return (
                                <Message key={index} message={messageData}></Message>
                            )
                        })
                    }
                </span>
              </React.Fragment>
            )}
          </p>
          <form onSubmit={sendMessage}>
            <button type='submit'>Enviar mensagem</button>

          </form>
        </div>
      );
}
