import React, { ComponentType } from "react";

const PrivateRouteHOC = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  const ProtectedRoute: React.FC<P> = (props) => {
    // const dispatch = useAppDispatch();
    // const router = useRouter();
    // const pathname = usePathname();
    // useEffect(() => {
    //   dispatch(getUserInfoThunk()).catch((_) => {
    //     //
    //   });
    // }, [dispatch]);

    // const {
    //   user,
    //   loaders: { getUserInfoLoading },
    // } = useAppSelector((state) => state.supplyAuth);

    // const { isLoading: initialLoading, isFetching } = useGetUserOrdersQuery(
    //   {
    //     id: user?.id,
    //   },
    //   {
    //     skip: !user?.id,
    //   }
    // );

    // const isLoggedin = user?.id && user?.email ? true : false;

    // if (getUserInfoLoading || initialLoading || isFetching) {
    //   return <Loader height="100vh" />;
    // }

    // if (!isLoggedin) {
    //   router.replace(`/login?navigateTo=${pathname}`);
    //   return null;
    // }

    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
};

export default PrivateRouteHOC;
