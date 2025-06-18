import React from "react";
import styles from "./ordered-list.module.css";

export function OrderedList({ children }: { children: React.ReactNode }) {
  return (
    <ol className={styles.wrapper}>
      {React.Children.toArray(children)
        .filter(Boolean)
        .map((child: any, index) =>
          child.props ? (
            <li className={styles.item} key={index}>
              <div>{child.props.children}</div>
            </li>
          ) : null
        )}
    </ol>
  );
}
