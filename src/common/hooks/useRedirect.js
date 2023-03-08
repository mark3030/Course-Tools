import { useMatch, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const useRedirect = () =>{
    const matchHome = useMatch("/");
    const navigate = useNavigate();
    const [ urlSearchParams ] = useSearchParams();
    const routeParams = useParams();
  
    const gotoPage = params => {
        const { pathname, query } = typeof params === 'string' ? { pathname: params } : params;
        let url = pathname.toLowerCase();
        query && Object.keys(query).forEach((key, i) => {
            if(i === 0) {
                url = `${url}?${key}=${query[key]}`;
            } else {
                url = `${url}&${key}=${query[key]}`;
            }
        });
        navigate(url);
    };

    const backHome = () => {
        if (Boolean(matchHome)) {
            window.location.reload();
        } else {
            gotoPage('/');
        }
    };

    const searchParams = () => {
        const params = { ...routeParams };
        for (const [key, value] of urlSearchParams.entries()) {
            params[key] = value;
        }

        return params;
    };

    return {
        gotoPage,
        backHome,
        searchParams
    };
}

export default useRedirect;