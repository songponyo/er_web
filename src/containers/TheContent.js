import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

import { AuthConsumer } from "../role-accress/authContext";

import routes from "../routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  const _generatePermission = (data) => {
    const permission = data.permissions.find(
      (item) => item.menu_name_en === data.permission_name
    );
    if (permission === undefined) {
      return {
        permission_view: true,
        permission_add: true,
        permission_edit: true,
        permission_approve: true,
        permission_cancel: true,
        permission_delete: true,
      };
    } else {
      return {
        permission_view: true,
        permission_add: true,
        permission_edit: true,
        permission_approve: true,
        permission_cancel: true,
        permission_delete: true,
      };
    }
  };

  return (
    <AuthConsumer>
      {({ user, permissions }) => (
        <main className="c-main">
          <CContainer fluid>
            <Suspense fallback={loading}>
              <Switch>
                {routes.map((route, idx) => {
                  return (
                    route.component && (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => (
                          <CFade>
                            <route.component
                              {...props}
                              SESSION={{
                                USER: user,
                                PERMISSION: _generatePermission({
                                  permissions: permissions,
                                  permission_name: route.permission_name,
                                }),
                              }}
                            />
                          </CFade>
                        )}
                      />
                    )
                  );
                })}
                {user.license_code == "SA-0001" ? (
                  <Redirect from="/" to="/class-group" />
                ) : user.license_code == "ST-0001" ? (
                  <Redirect from="/" to="/course-student" />
                ) : (
                  <Redirect from="/" to="/user" />
                )}
              </Switch>
            </Suspense>
          </CContainer>
        </main>
      )}
    </AuthConsumer>
  );
};

export default React.memo(TheContent);
