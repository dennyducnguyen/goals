export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="https://id.imgroup.vn/public/modules/account/images/logo_imgroup.png"
            alt="IM GROUP Logo"
            style={{ width: '200px', height: 'auto', objectFit: 'contain' }}
            className=""
        />
    );
}
