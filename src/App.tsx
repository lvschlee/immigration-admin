import { initializeApp } from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type Post = {
  title: string;
}

export function App() {
  const [posts, loading] = useCollectionData(collection(db, 'posts'));

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Test</h1>
      </header>

      <section>
        <table>
          <thead>
            <tr>
              <th>title</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(posts)
              ? posts.map((post) => (
                  <tr key={post.title}>
                    <td>{post.title}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <form action="">
          <div>
            <label htmlFor=""></label>
            <input type="text" />
          </div>
          <div>
            <label htmlFor=""></label>
            <input type="text" />
          </div>
          <div>
            <input type="submit" value="создать" />
          </div>
        </form>
      </section>
    </div>
  );
}
